import { Button } from "@mui/material"
import { Timestamp, collection, doc, writeBatch } from "firebase/firestore"
import { User } from "firebase/auth"
import { db } from "../config/firebase"
import { parseAddress } from "../util/address"
import { DocType } from "../interfaces"

type PropsType = {
  user: User
}

const statusOptions = ["Inquiry", "Onboarding", "Active", "Churned"]

export default function SampleDataGenerator({ user }: PropsType) {
  const fetchData = async (type: string, query: string): Promise<string[]> => {
    const url = `https://randommer.io/api/${type}?${query}`
    const apiKey = "5512d1c7f09340ea85c430bc06792e1d"

    const response = await fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
      },
    })

    return await response.json()
  }
  const populateSampleData = async () => {
    const firstNameParam = new URLSearchParams([
      ["nameType", "firstname"],
      ["quantity", "10"],
    ])
    const lastNameParam = new URLSearchParams([
      ["nameType", "surname"],
      ["quantity", "10"],
    ])
    const addressParam = new URLSearchParams([["number", "10"]])

    let docs: DocType[] = []

    // 1689996053000 is today in epoch time.
    for (let i = 0; i < 10; i++) {
      docs.push({
        uid: user.uid,
        status: statusOptions[i % 4],
        firstName: "",
        middleName: "",
        lastName: "",
        dob: Timestamp.fromDate(
          new Date(Math.floor(Math.random() * 1689996053000))
        ),
        addresses: [],
      })
    }

    await Promise.all([
      fetchData("Name", firstNameParam.toString()).then((data: string[]) => {
        data.forEach((value: string, index: number) => {
          if (index < docs.length) {
            docs[index].firstName = value
          }
        })
      }),
      fetchData("Name", lastNameParam.toString()).then((data: string[]) => {
        data.forEach((value: string, index: number) => {
          if (index < docs.length) {
            docs[index].lastName = value
          }
        })
      }),
      fetchData("Misc/Random-Address", addressParam.toString()).then(
        (data: string[]) => {
          data.forEach((value: string, index: number) => {
            const parsedAddress = parseAddress(value)
            if (index < docs.length && parsedAddress !== null) {
              docs[index].addresses = [parsedAddress]
            }
          })
        }
      ),
    ])
    const batch = writeBatch(db)
    docs.forEach((document) => {
      const docRef = doc(collection(db, "patients"))
      batch.set(docRef, document)
    })

    await batch
      .commit()
      .then(() => {
        console.log("batch update successful")
      })
      .catch((error) => {
        console.log("batch update error: ", error)
      })
  }
  return <Button onClick={populateSampleData}>Populate sample data</Button>
}
