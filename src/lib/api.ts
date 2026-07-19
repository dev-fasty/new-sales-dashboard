export interface Deal {
  id: string;
  sales: string;
  createDate: string;
  customer: string;
  project: string;
  rev: number;
  gp: number;
  percentClose: number;
  status: 'Closed Won' | 'Negotiation' | 'Proposal' | 'Waiting for announcement' | 'Lost';
}

export type DateFilter = 'Weekly' | 'Monthly' | 'Quarterly';

export async function fetchSheetData<T = unknown>(sheetName: string): Promise<T[]> {
  const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL;
  
  if (!GAS_URL) {
    throw new Error("NEXT_PUBLIC_GAS_URL environment variable is not defined.");
  }

  try {
    const response = await fetch(`${GAS_URL}?sheet=${encodeURIComponent(sheetName)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Cache settings can be adjusted depending on how fresh the data needs to be
      cache: 'no-store' 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from sheet: ${sheetName}. Status: ${response.status}`);
    }

    const rawData = await response.json();
    
    if (!Array.isArray(rawData)) {
      return [];
    }

    // Map the raw Google Sheet headers to our Deal interface
    if (sheetName === 'Pipeline' || sheetName === 'Dashboard') {
      if (rawData.length === 0) return [];
      
      // 1. Recover the first row (which accidentally became the keys)
      const firstRow = Object.keys(rawData[0]);
      
      // 2. Extract values for the rest of the rows
      const restRows = rawData.map(row => Object.values(row));
      
      // 3. Combine into a clean 2D array
      const allRows = [firstRow, ...restRows];
      
      // 4. Map by Index
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedData = allRows.map((row: any[], index: number) => ({
        id: String(index),
        sales: String(row[0] || ''),
        createDate: String(row[1] || ''),
        customer: String(row[5] || ''),
        project: String(row[6] || ''),
        rev: Number(row[7]) || 0,
        gp: Number(row[8]) || 0,
        percentClose: Number(row[9]) || 0,
        status: String(row[12] || 'Unknown') as Deal['status']
      }));
      
      return mappedData as T[];
    }

    return rawData as T[];
  } catch (error) {
    console.error(`Error fetching ${sheetName} data:`, error);
    throw error;
  }
}
