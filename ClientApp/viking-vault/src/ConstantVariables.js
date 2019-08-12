import { timeout } from "q";

const constants = {
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://viking-vault.azurewebsites.net/api/' : "https://localhost:44323/"
    baseUrl: "https://localhost:44323/api/",
    ratesRefreshInterval: 5000
}

export {constants};