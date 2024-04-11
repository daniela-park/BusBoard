import { useState } from 'react'
import './App.css'

// interface PostCode {
//   status: number
//   result: {
//     latitude: string
//     longitude: string
//   }
// }

interface BusInfo {
  stopPoints: [
    {
      lineModeGroups: [
        {
          lineIdentifier: [string, string, string, string, string]
        }
      ]
    }
  ]
}

function App() {
  // const [postCode, setPostCode] = useState<PostCode>()
  const [busInfo, setBusInfo] = useState<BusInfo>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    // setPostCode(undefined)
    setBusInfo(undefined)
    setError(false)

    const formData = new FormData(event.target as HTMLFormElement)
    const validPostCode = formData.get("validPostCode")

    const postCodeUrl = `https://api.postcodes.io/postcodes/${validPostCode}`
    const fetchPostCodeApi = async () => { let postCodeApi = await fetch(postCodeUrl); return postCodeApi.json(); };
    const postCodeInfo = await fetchPostCodeApi();
    const postCodeStatus = postCodeInfo.status
    while (postCodeStatus != 200) {
      try {
        if (postCodeStatus != 200) {
          throw 'Invalid postcode';
        }
      }
      catch (error) {
        console.log('Invalid postcode. Please try again.')
      }
    }

    const fetchLat = async () => { let lat = await fetch(postCodeUrl); return lat.json(); };
    let lat = await fetchLat();
    lat = lat.result.latitude

    const fetchLon = async () => { let lon = await fetch(postCodeUrl); return lon.json(); };
    let lon = await fetchLon();
    lon = lon.result.longitude

    if (validPostCode) {
      setLoading(true)
      fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram`)
        .then((response) => response.json())
        .then((data) => setBusInfo(data))
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    }
  }

  const buses = []
  if (busInfo) {
    for (let i = 0; i < busInfo.stopPoints[0].lineModeGroups[0].lineIdentifier.length; i++) {
      buses.push({
        id: i,
        busNumber: busInfo.stopPoints[0].lineModeGroups[0].lineIdentifier[i]
      })
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
            <h2>The buses nearby are:</h2>
            <div>
              {buses.map((bus) => (
                <div key={bus.id}>
                  <li>{bus.busNumber}</li>
                </div>
              ))}
            </div>
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
