interface PutOptions {
    contentType?: string
    encoding?: 'utf-8' | 'base64'
}

interface PutResult {
    key: string
    url: string | null
    size: number
}

interface StorageObject {
    key: string
    name: string
    size: number
    url: string | null
}

interface ListResult {
    folders: Array<string>
    files: Array<StorageObject>
    nextToken: string | null
}

interface GetResult {
    key: string
    contentType: string
    encoding: 'base64'
    body: string
    size: number
}

interface DeleteResult {
    deleted: number
}

interface FolderResult {
    name: string
}

interface MoveResult {
    moved: number
    skipped: number
    failed: number
}

const base = (): string => process.env.MODULIFY_API_URL || ''
const storageKey = (): string => process.env.MODULIFY_STORAGE_KEY || ''

const request = async <T>(path: string, body: Record<string, unknown>): Promise<T> => {
    if (typeof window !== 'undefined') throw new Error('@/lib/modulify/storage is server-only and must not be used in a client component.')

    if (!base() || !storageKey()) throw new Error('Storage is not configured for this environment.')

    const response = await fetch(`${base()}/site-storage${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Storage-Key': storageKey()
        },
        body: JSON.stringify(body)
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok || !payload || payload.success !== true) throw new Error(payload?.message || `Storage request failed with status ${response.status}.`)

    return payload.data as T
}

export const putObject = (key: string, body: string, options: PutOptions = {}): Promise<PutResult> =>
    request<PutResult>('/put', { key, body, contentType: options.contentType, encoding: options.encoding })

export const getObject = (key: string): Promise<GetResult> =>
    request<GetResult>('/get', { key })

export const getObjectText = async (key: string): Promise<string> => {
    const result = await getObject(key)

    return Buffer.from(result.body, 'base64').toString('utf-8')
}

export const listObjects = (prefix = '', token: string | null = null): Promise<ListResult> =>
    request<ListResult>('/list', { prefix, token })

export const deleteObject = (key: string): Promise<DeleteResult> =>
    request<DeleteResult>('/delete', { key })

export const deleteObjects = (keys: Array<string>): Promise<DeleteResult> =>
    request<DeleteResult>('/delete', { keys })

export const createFolder = (name: string, path = ''): Promise<FolderResult> =>
    request<FolderResult>('/create-folder', { name, path })

export const deleteFolder = (path: string): Promise<DeleteResult> =>
    request<DeleteResult>('/delete-folder', { path })

export const moveObjects = (keys: Array<string>, destination: string): Promise<MoveResult> =>
    request<MoveResult>('/move', { keys, destination })