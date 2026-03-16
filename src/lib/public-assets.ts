import { existsSync } from 'node:fs';
import { withBase } from './urls';

interface AssetMetadataLike {
	src: string;
}

type AssetModuleValue = string | AssetMetadataLike;

const bundledAssetModules = import.meta.glob('../assets/**/*.{avif,gif,jpeg,jpg,png,svg,webp}', {
	eager: true,
	import: 'default',
}) as Record<string, AssetModuleValue>;

function getBundledAssetUrl(asset: AssetModuleValue | undefined): string | undefined {
	if (typeof asset === 'string') {
		return asset;
	}

	if (asset && typeof asset.src === 'string') {
		return asset.src;
	}

	return undefined;
}

function isExternalUrl(path?: string): boolean {
	return typeof path === 'string' && /^https?:\/\//.test(path);
}

function normalizeBundledAssetKey(path?: string): string | undefined {
	if (!path) {
		return undefined;
	}

	if (path.startsWith('/src/assets/')) {
		return `../assets/${path.slice('/src/assets/'.length)}`;
	}

	if (path.startsWith('src/assets/')) {
		return `../assets/${path.slice('src/assets/'.length)}`;
	}

	if (path.startsWith('/assets/')) {
		return `../assets/${path.slice('/assets/'.length)}`;
	}

	if (path.startsWith('assets/')) {
		return `../assets/${path.slice('assets/'.length)}`;
	}

	if (path.startsWith('/projects/')) {
		return `../assets/projects/${path.slice('/projects/'.length)}`;
	}

	if (path.startsWith('projects/')) {
		return `../assets/projects/${path.slice('projects/'.length)}`;
	}

	return undefined;
}

export function resolveAssetObject(path?: string): any {
	if (!path) {
		return undefined;
	}

	if (isExternalUrl(path)) {
		return path;
	}

	const bundledAssetKey = normalizeBundledAssetKey(path);
	if (bundledAssetKey) {
		return bundledAssetModules[bundledAssetKey];
	}

	return path;
}

export function resolveAssetPath(path?: string): string | undefined {
	if (!path) {
		return undefined;
	}

	if (isExternalUrl(path)) {
		return path;
	}

	const bundledAssetKey = normalizeBundledAssetKey(path);
	if (bundledAssetKey) {
		const bundledAssetUrl = getBundledAssetUrl(bundledAssetModules[bundledAssetKey]);
		if (bundledAssetUrl) {
			return bundledAssetUrl;
		}
	}

	if (path.startsWith('/') && existsSync(new URL(`../../public${path}`, import.meta.url))) {
		return withBase(path);
	}

	return undefined;
}

function getAssetSourcePath(path?: string): string | undefined {
	if (!path) {
		return undefined;
	}

	if (isExternalUrl(path)) {
		return path;
	}

	const bundledAssetKey = normalizeBundledAssetKey(path);
	if (bundledAssetKey) {
		return bundledAssetKey.replace('../assets/', 'src/assets/');
	}

	if (path.startsWith('/')) {
		return `public${path}`;
	}

	return path;
}

export function requireAssetPath(path: string | undefined, label: string): string {
	const resolved = resolveAssetPath(path);
	if (resolved) {
		return resolved;
	}

	const sourcePath = getAssetSourcePath(path) ?? path ?? '(missing path)';
	throw new Error(`Missing required asset for ${label}: ${sourcePath}`);
}
