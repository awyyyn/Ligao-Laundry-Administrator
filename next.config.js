/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, 
  env: {
    NEXT_PUBLIC_SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dnlieHF0dWZ1aWtleHRvY2R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MDgxMDI5NSwiZXhwIjoxOTk2Mzg2Mjk1fQ.bYFvteeovjFcN2SMBrTSJbfWx7enzSLiZZXxqanmRn4',
    NEXT_PUBLIC_SUPABASE_URL: 'https://yuvybxqtufuikextocdz.supabase.co' 
  }
}

module.exports = nextConfig
