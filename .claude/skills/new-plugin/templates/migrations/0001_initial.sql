PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS {{PLUGIN_ID}}_metadata (
  document_id INTEGER PRIMARY KEY,
  -- TODO: add plugin-owned columns here.
  FOREIGN KEY (document_id) REFERENCES documents(id)
);
