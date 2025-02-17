import { supabase } from '@/utils/supabase/server';

// export default async function Notes() {
//   const { data: notes } = await supabase.from("notes").select();

//   return <pre>{JSON.stringify(notes, null, 2)}</pre>
// }

// const { data: notes, error } = await supabase.from("notes").select("*");

// console.log("✅ Notes Data:", notes);  // Frontend Log
// console.log("❌ Supabase Error:", error); // Log errors if any


export default async function Notes() {
    const { data: coordinates, error } = await supabase.from("coordinates").select("*");
  
    if (error) {
      return <pre>Error: {error.message}</pre>;
    }
  
    return <pre>{JSON.stringify(coordinates, null, 2)}</pre>;
  }
  