import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: 400,
    margin: '5vh auto',
    padding: '2rem',
    borderRadius: 12,
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    minHeight: '50vh',
    width: '90vw',
    boxSizing: 'border-box',
  },
  title: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '1.6rem',
    marginBottom: 0,
    color: '#222',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: 6,
    outline: 'none',
    marginBottom: 0,
    boxSizing: 'border-box',
    background: '#fafafa',
  },
  phoneRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  dialCode: {
    minWidth: 60,
    padding: '0.75rem',
    background: '#f5f5f5',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: '1rem',
    textAlign: 'center',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: 6,
    outline: 'none',
    marginBottom: 0,
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: 6,
    background: '#007bff',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 0,
    transition: 'background 0.2s',
  },
  buttonSecondary: {
    background: '#f1f1f1',
    color: '#333',
    marginTop: 8,
  },
  error: {
    color: '#d32f2f',
    textAlign: 'center',
    fontSize: '0.98rem',
    marginTop: 0,
  },
  info: {
    color: '#007bff',
    textAlign: 'center',
    fontSize: '0.98rem',
    marginTop: 0,
  },
};

function LoginWithOTP({ onLogin }) {
  const [step, setStep] = useState('login'); // 'login' or 'otp'
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch country data
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=idd,name,cca2')
      .then(res => res.json())
      .then(data => {
        // Filter countries with dial codes
        const filtered = data
          .filter(c => c.idd && c.idd.root)
          .map(c => ({
            code: c.cca2,
            name: c.name.common,
            dialCode: c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : ''),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(filtered);
        // Default to India if present, else first
        const defaultCountry = filtered.find(c => c.code === 'IN') || filtered[0];
        setCountry(defaultCountry);
      });
  }, []);

  // Phone validation (strict: 10 digits only)
  const isValidPhone = (phone) => /^\d{10}$/.test(phone);

  // Simulate sending OTP
  const handleSendOtp = () => {
    setError('');
    setInfo('');
    if (!country || !phone) {
      setError('Please select country and enter your phone number.');
      return;
    }
    if (!isValidPhone(phone)) {
      setError('Enter a valid phone number as per country code (6-15 digits).');
      return;
    }
    setLoading(true);
    setInfo('Sending OTP...');
    setTimeout(() => {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(generatedOtp);
      setStep('otp');
      setInfo('OTP sent! (Demo: ' + generatedOtp + ')'); // Remove in production
      setOtp('');
      setLoading(false);
    }, 1200);
  };

  // Simulate OTP validation
  const handleVerifyOtp = () => {
    setError('');
    setInfo('');
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    setLoading(true);
    setInfo('Verifying OTP...');
    setTimeout(() => {
      if (otp === sentOtp) {
        setInfo('Login/Signup successful!');
        setTimeout(() => {
          if (onLogin) onLogin();
          navigate('/dashboard', { replace: true });
        }, 800);
      } else {
        setError('Invalid OTP. Please try again.');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>OTP Login / Signup</h2>
      {step === 'login' && (
        <>
          <select
            style={styles.select}
            value={country ? country.code : ''}
            onChange={e => {
              const selected = countries.find(c => c.code === e.target.value);
              setCountry(selected);
            }}
            disabled={loading}
          >
            {countries.map(c => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dialCode})
              </option>
            ))}
          </select>
          <div style={styles.phoneRow}>
            <span style={styles.dialCode}>{country ? country.dialCode : ''}</span>
            <input
              style={styles.input}
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              maxLength={15}
              disabled={loading}
              autoFocus
            />
          </div>
          <button style={styles.button} onClick={handleSendOtp} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </>
      )}
      {step === 'otp' && (
        <>
          <div style={styles.phoneRow}>
            <span style={styles.dialCode}>{country ? country.dialCode : ''}</span>
            <input
              style={styles.input}
              type="tel"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              disabled={loading}
              autoFocus
            />
          </div>
          <button style={styles.button} onClick={handleVerifyOtp} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={() => {
              setStep('login');
              setOtp('');
              setError('');
              setInfo('');
            }}
            disabled={loading}
          >
            Back
          </button>
        </>
      )}
      {error && <div style={styles.error}>{error}</div>}
      {info && <div style={styles.info}>{info}</div>}
    </div>
  );
}

export default LoginWithOTP;
