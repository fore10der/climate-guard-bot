interface TokenResponseSuccess {
    access_token: string
}

type TokenResponseError = string

export interface TokenResponse {
    success: TokenResponseSuccess
    error: TokenResponseError
}
