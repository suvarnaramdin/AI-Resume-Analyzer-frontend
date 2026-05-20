import { useState } from "react"

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar"

import "react-circular-progressbar/dist/styles.css"

import jsPDF from "jspdf"

function App() {

  const [file, setFile] = useState(null)

  const [result, setResult] = useState("")

  const [loading, setLoading] = useState(false)

  const [atsScore, setAtsScore] = useState(82)

  const [jobDescription, setJobDescription] = useState("")

  // PDF DOWNLOAD FUNCTION
  const downloadPDF = () => {

    const doc = new jsPDF()

    doc.setFontSize(22)

    doc.text(
      "AI Resume ATS Report",
      20,
      20
    )

    doc.setFontSize(12)

    const splitText =
      doc.splitTextToSize(
        result,
        170
      )

    doc.text(
      splitText,
      20,
      40
    )

    doc.save(
      "ATS_Report.pdf"
    )
  }
  <textarea
  placeholder="Paste Job Description Here..."
  value={jobDescription}
  onChange={(e) =>
    setJobDescription(e.target.value)
  }
  className="w-full bg-gray-800 p-4 rounded-xl border border-gray-700 h-40 mb-5"
></textarea>

  // HANDLE RESUME UPLOAD
  const handleUpload = async () => {

    if (!file) {

      alert("Please select a file")

      return
    }

    const formData = new FormData()

    formData.append("resume", file)

    formData.append(
  "job_description",
  jobDescription
)

    try {

      setLoading(true)

      const response = await fetch(
        "http://localhost:5000/upload",
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()

      setResult(
        data.analysis || data.error
      )

      // Extract ATS Score
      const match =
        data.analysis.match(/(\d{1,3})%/)

      if (match) {

        setAtsScore(
          parseInt(match[1])
        )
      }

    } catch (err) {

      console.log(err)

      setResult("Server Error")

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">

      {/* Navbar */}

      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-800">

        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          AI Resume Analyzer
        </h1>

        <button className="bg-blue-600 hover:bg-blue-500 transition-all px-5 py-2 rounded-xl font-semibold">
          Dashboard
        </button>

      </nav>

      {/* Hero Section */}

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

        {/* Left Side */}

        <div>

          <h1 className="text-6xl font-bold leading-tight">

            Boost Your Resume With

            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              {" "}AI ATS Analysis
            </span>

          </h1>

          <p className="text-gray-400 mt-6 text-lg leading-8">

            Upload your resume and get
            AI-powered ATS score,
            keyword analysis,
            recruiter insights,
            and improvement suggestions.

          </p>

          <div className="flex gap-4 mt-8">

            <button className="bg-blue-600 hover:bg-blue-500 transition-all px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/40">
              Get Started
            </button>

            <button className="border border-gray-700 hover:border-blue-500 transition-all px-6 py-3 rounded-xl font-semibold">
              Learn More
            </button>

          </div>

        </div>

        {/* Upload Card */}

        <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-3xl p-8 shadow-2xl">

          <h2 className="text-3xl font-bold mb-6">
            Upload Resume
          </h2>

          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
            className="w-full bg-gray-800 p-4 rounded-xl border border-gray-700"
          />

          <button
            onClick={handleUpload}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 transition-all duration-300 p-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-blue-500/40"
          >

            {
              loading
                ? "Analyzing..."
                : "Analyze Resume"
            }

          </button>

        </div>

      </div>

      {/* RESULTS */}

      {
        result && (

          <div className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-6">

            {/* Analysis */}

            <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-3xl p-8 shadow-2xl">

              <h2 className="text-3xl font-bold mb-6">
                ATS Analysis Result
              </h2>

              <pre className="whitespace-pre-wrap text-gray-300 leading-8">
                {result}
              </pre>

              <button
                onClick={downloadPDF}
                className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Download PDF Report
              </button>

            </div>

            {/* ATS Score */}

            <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center">

              <h2 className="text-3xl font-bold mb-8">
                ATS Score
              </h2>

              <div className="w-56 h-56">

                <CircularProgressbar
                  value={atsScore}
                  text={`${atsScore}%`}
                  styles={buildStyles({
                    textColor: "#ffffff",
                    pathColor: "#3b82f6",
                    trailColor: "#1f2937"
                  })}
                />

              </div>

              <p className="text-gray-400 mt-8 text-center">

                Higher ATS score improves
                recruiter shortlisting chances.

              </p>

            </div>

          </div>
        )
      }

    </div>
  )
}

export default App