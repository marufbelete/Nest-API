-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
