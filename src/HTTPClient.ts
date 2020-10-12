// Copyright (c) 2020, Brandon Lehmann, The TurtlePay Developers
//
// Please see the included LICENSE file for more information.

import * as http from 'http';
import * as https from 'https';
import fetch, { Headers } from 'node-fetch';
import { format } from 'util';
import { AbortController } from 'abort-controller';

/** @ignore */
const packageInfo = require('../package.json');

export namespace Types {
    /**
     * Represents a library response
     */
    export interface Response<T> {
        /**
         * The Response status code
         */
        statusCode: number;

        /**
         * The response text (if any)
         */
        statusText: string;

        /**
         * The response body parsed from JSON
         */
        body: T;
    }

    /**
     * Represents a header value
     */
    export interface Header {
        /**
         * Represents the header name
         */
        name: string;

        /**
         * Represents the header value
         */
        value: string;
    }

    /**
     * Represents Request Options
     */
    export interface RequestOptions {
        /**
         * Represents the API call timeout value
         */
        timeout?: number;

        /**
         * Represents additional headers to include
         */
        headers?: Header[];
    }
}

/**
 * A common interface for interacting with a HTTP/S service
 */
export class HTTPClient {
    private readonly m_host: string;
    private readonly m_port: number;
    private readonly m_proto: string;
    private readonly m_timeout: number;
    private readonly m_userAgent: string;
    private readonly m_keepAlive: boolean;
    private readonly m_apiKey?: string;
    private readonly m_ssl: boolean;
    private readonly m_agent: https.Agent | http.Agent;

    /**
     * Constructs a new instance of the interface
     * @param host the host name/ip to place calls against
     * @param port the port of the host to connect to
     * @param ssl whether to use SSL/TLS
     * @param timeout the default request timeout
     * @param keepAlive whether the interface should use HTTP keep alive mechanisms
     * @param userAgent the user agent to provide to the server
     * @param apiKey the api key via X-API-KEY header to use
     */
    constructor (
        host = '127.0.0.1',
        port = 80,
        ssl = false,
        timeout = 2000,
        keepAlive = true,
        userAgent: string = format('%s/%s', packageInfo.name, packageInfo.version),
        apiKey?: string
    ) {
        this.m_host = host;
        this.m_port = port;
        this.m_timeout = timeout;
        this.m_userAgent = userAgent;
        this.m_keepAlive = keepAlive;
        this.m_ssl = ssl;
        this.m_proto = (ssl) ? 'https' : 'http';

        if (apiKey) {
            this.m_apiKey = apiKey;
        }

        if (this.ssl) {
            this.m_agent = new https.Agent({
                rejectUnauthorized: false,
                keepAlive: this.keepAlive
            });
        } else {
            this.m_agent = new http.Agent({
                keepAlive: this.keepAlive
            });
        }
    }

    /**
     * The host to make calls against
     * @protected
     */
    protected get host (): string {
        return this.m_host;
    }

    /**
     * The port of the host to make calls against
     * @protected
     */
    protected get port (): number {
        return this.m_port;
    }

    /**
     * The default timeout for requests
     * @protected
     */
    protected get timeout (): number {
        return this.m_timeout;
    }

    /**
     * The user agent for the interface
     * @protected
     */
    protected get userAgent (): string {
        return this.m_userAgent;
    }

    /**
     * The underlying transport protocol used for the interface
     * @protected
     */
    protected get protocol (): string {
        return this.m_proto;
    }

    /**
     * The underlying http/https agent for the interface
     * @protected
     */
    protected get agent (): https.Agent | http.Agent {
        return this.m_agent;
    }

    /**
     * Whether SSL/TLS is being used for the interface
     * @protected
     */
    protected get ssl (): boolean {
        return this.m_ssl;
    }

    /**
     * The API key included in the X-API-KEY header
     * @protected
     */
    protected get apiKey (): string | undefined {
        return this.m_apiKey;
    }

    /**
     * Whether HTTP keep alive mechanisms are used
     * @protected
     */
    protected get keepAlive (): boolean {
        return this.m_keepAlive;
    }

    /**
     * The base headers included in every request
     * @protected
     */
    protected get headers (): Headers {
        const headers = new Headers();

        headers.set('Accept', 'application/json');

        headers.set('Content-type', 'application/json');

        headers.set('User-Agent', this.userAgent);

        if (this.apiKey) {
            headers.set('X-API-KEY', this.apiKey);
        }

        return headers;
    }

    /**
     * Performs a DELETE operation
     * @param endpoint the endpoint to call
     * @param options request specific options
     * @protected
     */
    protected async delete<ResponseType> (
        endpoint: string,
        options?: Types.RequestOptions
    ): Promise<Types.Response<ResponseType>> {
        return this.fetch<void, ResponseType>('delete', endpoint, undefined, options);
    }

    /**
     * Performs a GET operation
     * @param endpoint the endpoint to call
     * @param options request specific options
     * @protected
     */
    protected async get<ResponseType> (
        endpoint: string,
        options?: Types.RequestOptions
    ): Promise<Types.Response<ResponseType>> {
        return this.fetch<void, ResponseType>('get', endpoint, undefined, options);
    }

    /**
     * Performs a PATCH operation
     * @param endpoint the endpoint to call
     * @param body the body information to include in the request
     * @param options request specific options
     * @protected
     */
    protected async patch<RequestType, ResponseType> (
        endpoint: string,
        body?: RequestType,
        options?: Types.RequestOptions
    ): Promise<Types.Response<ResponseType>> {
        return this.fetch<RequestType, ResponseType>('patch', endpoint, body, options);
    }

    /**
     * Performs a POST operation
     * @param endpoint the endpoint to call
     * @param body the body information to include in the request
     * @param options request specific options
     * @protected
     */
    protected async post<RequestType, ResponseType> (
        endpoint: string,
        body?: RequestType,
        options?: Types.RequestOptions
    ): Promise<Types.Response<ResponseType>> {
        return this.fetch<RequestType, ResponseType>('post', endpoint, body, options);
    }

    /**
     * Performs a PUT operation
     * @param endpoint the endpoint to call
     * @param body the body information to include in the request
     * @param options request specific options
     * @protected
     */
    protected async put<RequestType, ResponseType> (
        endpoint: string,
        body?: RequestType,
        options?: Types.RequestOptions
    ): Promise<Types.Response<ResponseType>> {
        return this.fetch<RequestType, ResponseType>('put', endpoint, body, options);
    }

    /**
     * Creates a well formed URL using the supplied endpoing for the host we are interacting with
     * @param endpoint the endpoint to call
     * @private
     */
    private url (endpoint: string): string {
        if (endpoint.substr(0, 1) !== '/') {
            endpoint = format('/%s', endpoint);
        }

        return format('%s://%s:%s%s', this.protocol, this.host, this.port, endpoint);
    }

    /**
     * Performs the underlying request as specified by the protected methods
     * @param method the HTTP method to call
     * @param endpoint the endpoint to call
     * @param requestBody the body information to include in the request
     * @param options request specific options
     * @private
     */
    private async fetch<Request, Response> (
        method: string,
        endpoint: string,
        requestBody?: Request,
        options?: Types.RequestOptions
    ): Promise<Types.Response<Response>> {
        const controller = new AbortController();

        const _timeout = setTimeout(() => controller.abort(), options?.timeout || this.timeout);

        const _headers = this.headers;

        if (options?.headers) {
            for (const header of options.headers) {
                _headers.append(header.name, header.value);
            }
        }

        const response = await fetch(this.url(endpoint), {
            headers: _headers,
            agent: this.agent,
            method: method.toLowerCase(),
            signal: controller.signal,
            body: (requestBody) ? JSON.stringify(requestBody) : undefined
        });

        clearTimeout(_timeout);

        const body = await response.json();

        return {
            statusCode: response.status,
            statusText: response.statusText,
            body: body
        };
    }
}
