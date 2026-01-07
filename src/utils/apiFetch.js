const host = import.meta.env.VITE_API_HOST_TEST;
const headers = {
  authorization: `Bearer ${import.meta.env.VITE_TOKEN_TEST}`,
  "Content-Type": "application/json",
};

export const apiFetch = async (endpoint, method, body) => {
  const options = {
    method: method,
    headers: headers,
  };
  if (body !== null) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${host}/${endpoint}`, options);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};
