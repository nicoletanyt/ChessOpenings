import React, { useEffect, useState } from "react";
import fileA from "../data/a.tsv"
import fileB from "../data/b.tsv"

export default function Openings() {
  const [openings, setOpenings] = useState([]);

  useEffect(() => {
    getOpenings()
  }, [])

  useEffect(() => {
  }, [openings])

  async function parseFile(file) {
    return await fetch(file)
    .then(r => r.text())
    .then(text => {
        let arr = text.split("\n")
        arr.shift()
        return arr
    })
  } 

  async function getOpenings() {
    let a = await parseFile(fileA)
    let b = await parseFile(fileB)
    let file = a.concat(b)
    for (let i = 0; i < file.length; ++i) {
        let parts = file[i].split("\t")
        let parsed = {
            "eco": parts[0],
            "name": parts[1], 
            "moves": parts[2]
            }
            setOpenings(openings => [...openings, parsed])
    }
  }


  return <div id="opening-wrapper">
    {
        openings.map((item, index) => (
            <div key={index}>
                <b>{item.name}</b>
                <p>{item.moves}</p>
            </div>
        ))
    }
  </div>;
}
