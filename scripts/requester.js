const baseUrl = "https://baas.kinvey.com";
const appKey = "kid_r1_2qt2hH";
const appSecret = "e60d219daed740299b2269feb7be1f2f";

function createAuthorisation(type) {
   return type === "Basic" 
    ? `Basic ${btoa(`${appKey}:${appSecret}`)}` 
    : `Kinvey ${sessionStorage.getItem("authtoken")}`;
}

function createHeaders(httpMethod, data, type) {
    const headers = {
        method: httpMethod,
        headers: {
            "Authorization": createAuthorisation(type),
            "Content-Type": "application/json"
        }
    }

    if (httpMethod === "POST" || httpMethod === "PUT") {
        headers.body = JSON.stringify(data);

    }

    return headers;
}

function handleError(e) {
    if (!e.ok) {
        throw new Error(e.statusText);
    }

    return e;
}

function serializeData(x) {
    if(x.status === 204){
        return x;
    }
    return x.json();
}

function fetchData(kinveyModule, endpoint, headers) {
    const url = `${baseUrl}/${kinveyModule}/${appKey}/${endpoint}`;

    return fetch(url, headers)
        .then(handleError)
        .then(serializeData)
}

function get(kinveyModule, endpoint, type) {
    const headers = createHeaders("GET", type);
    return fetchData(kinveyModule, endpoint, headers);
}

function post(kinveyModule, endpoint, data, type) {
    const headers = createHeaders("POST", data, type);
    return fetchData(kinveyModule, endpoint, headers);
}

function put(kinveyModule, endpoint, data, type) {
    const headers = createHeaders("PUT", data, type);
    return fetchData(kinveyModule, endpoint, headers);
}

function del(kinveyModule, endpoint, type) {
    const headers = createHeaders("DELETE", type);
    return fetchData(kinveyModule, endpoint, headers);
}

export {
    get,
    post,
    put,
    del
};