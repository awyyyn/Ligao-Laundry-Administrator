import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    'https://yuvybxqtufuikextocdz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dnlieHF0dWZ1aWtleHRvY2R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MDgxMDI5NSwiZXhwIjoxOTk2Mzg2Mjk1fQ.bYFvteeovjFcN2SMBrTSJbfWx7enzSLiZZXxqanmRn4'
    , {
        auth: {
            autoRefreshToken: true,
    
        }
    }

)