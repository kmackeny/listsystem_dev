import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:9001/api';

interface Company {
  id: number;
  name: string;
  area: string;
  phone_number: string;
  website_url: string;
}

interface CallHistory {
  id: number;
  company_id: number;
  person_in_charge: string;
  result: string;
  memo: string;
  created_at: string;
}

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [history, setHistory] = useState<CallHistory[]>([]);

  // State for new company form
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyArea, setNewCompanyArea] = useState('');
  const [newCompanyPhone, setNewCompanyPhone] = useState('');
  const [newCompanyUrl, setNewCompanyUrl] = useState('');

  // State for new history form
  const [newHistoryPerson, setNewHistoryPerson] = useState('');
  const [newHistoryResult, setNewHistoryResult] = useState('');
  const [newHistoryMemo, setNewHistoryMemo] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchHistory = async (companyId: number) => {
    try {
      const response = await axios.get(`${API_URL}/companies/${companyId}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    fetchHistory(company.id);
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/companies`, {
        name: newCompanyName,
        area: newCompanyArea,
        phone_number: newCompanyPhone,
        website_url: newCompanyUrl,
      });
      setCompanies([response.data, ...companies]);
      // Reset form
      setNewCompanyName('');
      setNewCompanyArea('');
      setNewCompanyPhone('');
      setNewCompanyUrl('');
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  const handleAddHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    try {
      const response = await axios.post(`${API_URL}/companies/${selectedCompany.id}/history`, {
        person_in_charge: newHistoryPerson,
        result: newHistoryResult,
        memo: newHistoryMemo,
      });
      setHistory([response.data, ...history]);
      // Reset form
      setNewHistoryPerson('');
      setNewHistoryResult('');
      setNewHistoryMemo('');
    } catch (error) {
      console.error('Error adding history:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>テレアポリストシステム</h1>
      </header>
      <div className="container">
        <div className="left-panel">
          <h2>企業リスト追加</h2>
          <form onSubmit={handleAddCompany} className="company-form">
            <input type="text" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} placeholder="企業名" required />
            <input type="text" value={newCompanyArea} onChange={(e) => setNewCompanyArea(e.target.value)} placeholder="地域" />
            <input type="text" value={newCompanyPhone} onChange={(e) => setNewCompanyPhone(e.target.value)} placeholder="電話番号" />
            <input type="text" value={newCompanyUrl} onChange={(e) => setNewCompanyUrl(e.target.value)} placeholder="HPのURL" />
            <button type="submit">リストに追加</button>
          </form>

          <h2>企業一覧</h2>
          <div className="company-list">
            {companies.map((company) => (
              <div key={company.id} className={`company-item ${selectedCompany?.id === company.id ? 'selected' : ''}`} onClick={() => handleCompanySelect(company)}>
                {company.name}
              </div>
            ))}
          </div>
        </div>
        <div className="right-panel">
          {selectedCompany ? (
            <div>
              <h2>{selectedCompany.name} - 架電履歴</h2>
              <div className="company-details">
                <p><strong>地域:</strong> {selectedCompany.area}</p>
                <p><strong>電話番号:</strong> {selectedCompany.phone_number}</p>
                <p><strong>URL:</strong> <a href={selectedCompany.website_url} target="_blank" rel="noopener noreferrer">{selectedCompany.website_url}</a></p>
              </div>

              <h3>履歴追加</h3>
              <form onSubmit={handleAddHistory} className="history-form">
                <input type="text" value={newHistoryPerson} onChange={(e) => setNewHistoryPerson(e.target.value)} placeholder="対応者" required />
                <input type="text" value={newHistoryResult} onChange={(e) => setNewHistoryResult(e.target.value)} placeholder="結果" required />
                <textarea value={newHistoryMemo} onChange={(e) => setNewHistoryMemo(e.target.value)} placeholder="メモ" />
                <button type="submit">履歴を追加</button>
              </form>

              <h3>履歴一覧</h3>
              <div className="history-list">
                {history.map((h) => (
                  <div key={h.id} className="history-item">
                    <p><strong>日時:</strong> {new Date(h.created_at).toLocaleString()}</p>
                    <p><strong>対応者:</strong> {h.person_in_charge}</p>
                    <p><strong>結果:</strong> {h.result}</p>
                    <p><strong>メモ:</strong> {h.memo}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>企業を選択してください</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
