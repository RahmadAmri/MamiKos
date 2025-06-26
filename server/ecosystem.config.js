module.exports = {
apps: [
{
name: "gc-01",
script: "bin/www",
env: {
NODE_ENV: "production",
PORT: 80,
JWT_SECRET: "keren",
DB_PASSWRORD: "6le1KwB2IDcTzTaf",
DATABASE_URL: "postgresql://postgres.aostjhatbweihlkqftqv:6le1KwB2IDcTzTaf@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
CLOUDINARY_CLOUD_NAME: "db8s4cdbq",
CLOUDINARY_API_KEY: "877888833343628",
CLOUDINARY_API_SECRET: "JvpjptjE_jg-CZJRIE9u4JykFr4"
}
}
]
}

