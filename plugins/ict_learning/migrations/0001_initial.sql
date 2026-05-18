PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS ict_learning_metadata (
  document_id INTEGER PRIMARY KEY,
  learning_objectives_markdown TEXT NOT NULL DEFAULT '',
  prerequisites_markdown TEXT NOT NULL DEFAULT '',
  difficulty TEXT CHECK (
    difficulty IS NULL
    OR difficulty IN ('beginner', 'intermediate', 'advanced')
  ),
  estimated_minutes INTEGER CHECK (
    estimated_minutes IS NULL
    OR estimated_minutes > 0
  ),
  last_verified_on TEXT,
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS ict_learning_required_equipment (
  document_id INTEGER NOT NULL,
  equipment TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (document_id, equipment),
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS ict_learning_required_software (
  document_id INTEGER NOT NULL,
  software TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (document_id, software),
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS ict_learning_supported_platforms (
  document_id INTEGER NOT NULL,
  os TEXT NOT NULL,
  version TEXT NOT NULL,
  PRIMARY KEY (document_id, os, version),
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS ict_learning_exercises (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  position INTEGER NOT NULL,
  UNIQUE (document_id, position),
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS ict_learning_quizzes (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL,
  question_markdown TEXT NOT NULL,
  answer_markdown TEXT NOT NULL,
  position INTEGER NOT NULL,
  UNIQUE (document_id, position),
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS ict_learning_troubleshooting (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL,
  symptom_markdown TEXT NOT NULL,
  resolution_markdown TEXT NOT NULL,
  position INTEGER NOT NULL,
  UNIQUE (document_id, position),
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE INDEX IF NOT EXISTS idx_ict_learning_metadata_difficulty
  ON ict_learning_metadata(difficulty);

CREATE INDEX IF NOT EXISTS idx_ict_learning_required_equipment_equipment
  ON ict_learning_required_equipment(equipment);

CREATE INDEX IF NOT EXISTS idx_ict_learning_supported_platforms_version
  ON ict_learning_supported_platforms(version);
