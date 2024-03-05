import {CacheInterceptor,  CACHE_KEY_METADATA } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  protected cachedRoutes = new Map();
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    // if there is no request, the incoming request is graphql, therefore bypass response caching.
    // later we can get the type of request (query/mutation) and if query get its field name, and attributes and cache accordingly. Otherwise, clear the cache in case of the request type is mutation.
    if (!request) {
      return undefined;
    }
    const { httpAdapter } = this.httpAdapterHost;
    const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
    const cacheMetadata = this.reflector.get(CACHE_KEY_METADATA, context.getHandler());

    if (!isHttpApp || cacheMetadata) {
      return cacheMetadata;
    }
    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    if (!isGetRequest) {
      setTimeout(async () => {
        for (const values of this.cachedRoutes.values()) {
          for (const value of values) {
            // you don't need to worry about the cache manager as you are extending their interceptor which is using caching manager as you've seen earlier.
            await this.cacheManager.del(value);
          }
        }
      }, 0);
      return undefined;
    }
    // to always get the base url of the incoming get request url.
    const key = httpAdapter.getRequestUrl(request).split('?')[0];
    if (this.cachedRoutes.has(key) && !this.cachedRoutes.get(key).includes(httpAdapter.getRequestUrl(request))) {
      this.cachedRoutes.set(key, [...this.cachedRoutes.get(key), httpAdapter.getRequestUrl(request)]);
      return httpAdapter.getRequestUrl(request);
    }
    this.cachedRoutes.set(key, [httpAdapter.getRequestUrl(request)]);
    return httpAdapter.getRequestUrl(request);
  }
}