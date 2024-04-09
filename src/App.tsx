import { useState } from 'react'
import './App.css'

interface BusInfo {
  postcode: string
  nearbyBuses: string
}

function App() {
  const [busInfo, setBusInfo] = useState<BusInfo>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    setBusInfo(undefined)
    setError(false)

    const formData = new FormData(event.target as HTMLFormElement)
    const validPostCode = formData.get("validPostCode")
    if (validPostCode) {
      setLoading(true)
      fetch(`https://api.postcodes.io/postcodes/${validPostCode}`)
        .then((response) => response.json())
        .then((data) => setBusInfo(data))
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    }
  }

  return (
    <main>
      <div className='backgroundImg'>
      <h2>Find nearby buses close to you!</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <h2>Enter a postcode:</h2>
          <br />
          <input type="text" name="validPostCode" />
        </label>
        <br />
        <br />
        <button type="submit">Show buses!</button>
      </form>

      {busInfo &&
      <div>
        <h2>The buses nearby {busInfo.postcode} are:</h2>
        <h2>{busInfo.nearbyBuses}</h2>
        </div>
      }

      {loading &&
      <p>Loading...</p>
      }

      {error &&
      <p>The postcode could not be found!</p>
      }
      </div>
    </main>
  )
}

export default App
