

export function parseTicketData(raw) {
  try {
    const data = JSON.parse(raw);
    return data; 
  } catch {

    return { raw };
  }
}
