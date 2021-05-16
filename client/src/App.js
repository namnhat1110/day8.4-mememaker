import React, { useState, useEffect } from 'react'
import './App.css';
import { Container, Row, Col, Form } from 'react-bootstrap'

function App() {
  const [memes, setMemes] = useState([])
  const [bottomText, setBottomText] = useState(``)
  const [topText, setTopText] = useState(``)
  const [file, setFile] = useState(null)

  useEffect(() => {
    async function getMemes() {
      const resp = await fetch('http://localhost:5000/api/memes')
      const json = await resp.json()
      console.log({ json })
      setMemes(json.data)
    }
    getMemes()
  }, [])

  const handleCreateMeme = async (e) => {
    e.preventDefault()
    if (!file) alert('No file detected')

    const formData = new FormData()

    formData.append('image', file)

    formData.append('text', JSON.stringify(
      {
        size: 64,
        color: "BLACK",
        alignmentX: "HORIZONTAL_ALIGN_CENTER",
        alignmentY: "VERTICAL_ALIGN_BOTTOM",
        content: bottomText
      }
    ))

    formData.append('text', JSON.stringify(
      {
        size: 64,
        color: "BLACK",
        alignmentX: "HORIZONTAL_ALIGN_CENTER",
        alignmentY: "VERTICAL_ALIGN_TOP",
        content: topText
      }
    ))

    const resp = await fetch('http://localhost:5000/api/memes', {
      method: 'POST',
      body: formData
    })
    const json = await resp.json()
    console.log({ json })
    setMemes([json.data, ...memes])
  }

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col lg='4' className='bg-light' style={{ height: window.innerHeight }}>
            <Row>
              <h1>Create memes</h1>
            </Row>
            <Row className='my-2'>
              <Col lg='3'>Text top: </Col>
              <Col lg='9'>
                <Form>
                  <input type='text' size='60' onChange={(e) => setTopText(e.target.value)} placeholder="What do you want on top" />
                </Form>
              </Col>
              <Col lg='3'>Text bottom: </Col>
              <Col lg='9'>
                <Form>
                  <input className='my-2' type='text' size='60' onChange={(e) => setBottomText(e.target.value)} placeholder="What do you want at bottom" />
                </Form>
              </Col>
            </Row>
            <Row className='my-2'>
              <Col lg='6'>
                <input type='file' onChange={(e) => setFile(e.target.files[0])} />
              </Col>
              <Col lg='6'>
                <button onClick={handleCreateMeme}>Upload file</button>
              </Col>

            </Row>

          </Col>
          <Col lg='8' className='bg-dark'>
            <h1>Memes</h1>
            {memes.map(m => {
              const url = 'http://localhost:5000/' + m.outputMemePath.split('public/')[1]
              return <img key={m.id} src={url} alt="memey" />
            })}</Col>
        </Row>
      </Container>


    </div>
  );
}

export default App;
