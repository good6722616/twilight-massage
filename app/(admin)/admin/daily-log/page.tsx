"use client"

import { useState } from "react"
import { format } from "date-fns"

type MassageRecord = {
  id: string
  date: string
  staffName: string
  massageType: string
  duration: number
  discount: number
  addOns: string[]
  tip: number
  calculatedIncome: number
}

const staffMembers = ["John Doe", "Jane Smith", "Mike Johnson"]
const massageTypes = ["Swedish", "Deep Tissue", "Sports", "Hot Stone"]
const durations = [30, 60, 90]
const discounts = [0, 10, 15, 20]
const addOns = ["Oil", "Hot Stone", "Aromatherapy"]

export default function DailyLogPage() {
  const [records, setRecords] = useState<MassageRecord[]>([])
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    staffName: staffMembers[0],
    massageType: massageTypes[0],
    duration: durations[1],
    discount: discounts[0],
    addOns: [] as string[],
    tip: 0,
  })

  const calculateIncome = () => {
    const basePrice = formData.duration * 2 // $2 per minute
    const addOnsPrice = formData.addOns.length * 3 // $3 per add-on
    const subtotal = basePrice + addOnsPrice
    const discountAmount = (subtotal * formData.discount) / 100
    return subtotal - discountAmount + formData.tip
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRecord: MassageRecord = {
      id: Date.now().toString(),
      ...formData,
      calculatedIncome: calculateIncome(),
    }
    setRecords([...records, newRecord])
    // Reset form
    setFormData({
      ...formData,
      addOns: [],
      tip: 0,
    })
  }

  const handleRemove = (id: string) => {
    setRecords(records.filter((record) => record.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Daily Log</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Staff Name
            </label>
            <select
              value={formData.staffName}
              onChange={(e) =>
                setFormData({ ...formData, staffName: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {staffMembers.map((staff) => (
                <option key={staff} value={staff}>
                  {staff}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Massage Type
            </label>
            <select
              value={formData.massageType}
              onChange={(e) =>
                setFormData({ ...formData, massageType: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {massageTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <select
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {durations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration} mins
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount
            </label>
            <select
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {discounts.map((discount) => (
                <option key={discount} value={discount}>
                  {discount}%
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add-ons
            </label>
            <select
              multiple
              value={formData.addOns}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  addOns: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {addOns.map((addOn) => (
                <option key={addOn} value={addOn}>
                  {addOn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tip Amount
            </label>
            <input
              type="number"
              value={formData.tip}
              onChange={(e) =>
                setFormData({ ...formData, tip: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-lg font-medium">
            Calculated Income: ${calculateIncome().toFixed(2)}
          </p>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Record
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Staff
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Add-ons
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tip
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Income
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {record.staffName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {record.massageType}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {record.duration} mins
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {record.discount}%
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {record.addOns.join(", ") || "None"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  ${record.tip.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  ${record.calculatedIncome.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <button
                    onClick={() => handleRemove(record.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
