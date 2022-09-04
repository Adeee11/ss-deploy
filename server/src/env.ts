export const env = (variable: 'HOST_NAME' | 'PORT') => {
    return process.env[variable]
}