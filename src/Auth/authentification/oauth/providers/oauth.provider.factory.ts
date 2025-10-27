import { Injectable } from '@nestjs/common';
import type { IOAuthProviderInterface } from '../oauth.interfaces';
import { GoogleOAuthProvider } from './oauth.google.provider';

@Injectable()
export class OAuthProviderFactory {
    constructor(private googleProvider: GoogleOAuthProvider) {
        this.registerProvider('google', this.googleProvider);
    }

    private providers = new Map<string, IOAuthProviderInterface>();

    registerProvider(name: string, provider: IOAuthProviderInterface): void {
        this.providers.set(name, provider);
    }

    getProvider(name: string): IOAuthProviderInterface {
        const provider = this.providers.get(name);

        if (!provider) {
            throw new Error(`OAuth provider '${name}' not found`);
        }

        return provider;
    }

    getSupportedProviders(): string[] {
        return Array.from(this.providers.keys());
    }
}
