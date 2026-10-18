CREATE TABLE prospects (
  slug          TEXT PRIMARY KEY,
  company_name  TEXT NOT NULL,
  industry      TEXT NOT NULL,
  city          TEXT NOT NULL,
  region        TEXT,
  phone         TEXT,
  nearby_areas  TEXT,
  created_at    INTEGER NOT NULL,
  archived      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_prospects_created ON prospects (created_at DESC);
