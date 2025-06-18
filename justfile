# Default recipe to run when just is called without arguments
default:
    @just --list

prebuild:
    cd apps/mobile && pnpm prebuild

# Run mobile app on iOS simulator
ios:
    cd apps/mobile && pnpm ios

# Run mobile app on Android emulator
android:
    cd apps/mobile && pnpm android

# Start the mobile app with Expo
start:
    cd apps/mobile && pnpm start

# Generate supabase types
type-gen $PROJECT_ID='':
    supabase gen types typescript --project-id $PROJECT_ID > apps/mobile/src/integrations/supabase/database.types.ts

# Start the database
db-start:
    supabase start

db-status:
    supabase status

db-stop:
    supabase stop

db-deploy-funcs:
    supabase functions deploy

db-deploy-func name='':
    supabase functions deploy {{name}}

# Install dependencies
install:
    pnpm install

# Remove node_modules from the workspace
clean:
    rm -rf node_modules
    rm -rf apps/mobile/node_modules
    rm -rf pnpm-lock.yaml
    rm -rf apps/mobile/pnpm-lock.yaml

# Reset dependencies and reinstall
reset: clean install

# Update all dependencies
update:
    pnpm update -r


# Clean up pnpm store to free up disk space
prune-store:
    pnpm store prune

# Run deduplication of dependencies
dedupe:
    pnpm dedupe


# Check if mobile app builds correctly for production
build-check:
    cd apps/mobile && pnpm expo prebuild

# Lint all files using Biome
lint:
    pnpm lint

# Format all files using Biome
format:
    pnpm format

# Check formatting without making changes
format-check:
    pnpm run check

# Fix all automatically fixable lint issues
lint-fix:
    npx @biomejs/biome lint --apply-unsafe .

# Check both linting and formatting
check: format-check

# Fix all formatting and linting issues automatically
fix-all:
    pnpm format
    npx @biomejs/biome check --apply-unsafe . 