CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    area VARCHAR(255),
    phone_number VARCHAR(50),
    website_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE call_history (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    person_in_charge VARCHAR(100),
    result VARCHAR(100),
    memo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add some dummy data
INSERT INTO companies (name, area, phone_number, website_url) VALUES
('株式会社A', '東京都', '03-1234-5678', 'https://example.com/a'),
('合同会社B', '大阪府', '06-1234-5678', 'https://example.com/b');

INSERT INTO call_history (company_id, person_in_charge, result, memo) VALUES
(1, '受付', '再コール', '担当者不在のため、明日再度連絡する'),
(2, '社長', 'アポ', '来週火曜14時に訪問のアポイント');
