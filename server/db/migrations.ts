export const UNTANGLE_SQL = `
CREATE TABLE IF NOT EXISTS untangle_projects (id TEXT PRIMARY KEY, owner_email TEXT NOT NULL, org_id TEXT, title TEXT NOT NULL, revision INTEGER NOT NULL CHECK (revision > 0), created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS untangle_projects_owner_idx ON untangle_projects(owner_email, org_id);
CREATE TABLE IF NOT EXISTS untangle_revisions (project_id TEXT NOT NULL REFERENCES untangle_projects(id), revision INTEGER NOT NULL, owner_email TEXT NOT NULL, org_id TEXT, state JSONB NOT NULL, event TEXT NOT NULL, actor TEXT NOT NULL, caller TEXT NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY(project_id, revision));
CREATE TABLE IF NOT EXISTS untangle_exports (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES untangle_projects(id), revision INTEGER NOT NULL, owner_email TEXT NOT NULL, org_id TEXT, brief TEXT NOT NULL, acknowledgment TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS untangle_exports_project_idx ON untangle_exports(project_id);
`;
