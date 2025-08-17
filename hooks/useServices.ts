import { useState, useEffect, useCallback } from "react"

export interface ServiceDuration {
  id: string
  duration: number
  customer_price: number
  staff_income: number
  is_active: boolean
}

export interface Service {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  durations: ServiceDuration[]
}

export interface ServiceList {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  durations_count: number
}

export function useServices() {
  const [services, setServices] = useState<ServiceList[]>([])
  const [serviceDetails, setServiceDetails] = useState<Record<string, Service>>(
    {}
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)

      // 使用批量 API 获取所有服务及其详细信息
      const response = await fetch("/api/services/details")

      if (!response.ok) {
        throw new Error("Failed to fetch services")
      }

      const servicesWithDetails: Service[] = await response.json()

      // 设置服务列表（用于下拉选择等）
      const serviceList: ServiceList[] = servicesWithDetails.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        is_active: service.is_active,
        created_at: service.created_at,
        updated_at: service.updated_at,
        durations_count: service.durations.length,
      }))

      setServices(serviceList)

      // 构建服务详情映射
      const detailsMap: Record<string, Service> = {}
      servicesWithDetails.forEach((service) => {
        detailsMap[service.name] = service
      })
      setServiceDetails(detailsMap)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // 获取服务名称列表（用于下拉选择）
  const getServiceNames = useCallback(() => {
    return services
      .filter((service) => service.is_active)
      .map((service) => service.name)
  }, [services])

  // 根据服务名称获取服务详情（带缓存）
  const getServiceByName = useCallback(
    async (serviceName: string): Promise<Service | null> => {
      try {
        // 如果已经缓存了，直接返回
        if (serviceDetails[serviceName]) {
          return serviceDetails[serviceName]
        }

        // 如果缓存中没有，尝试重新获取（这种情况应该很少发生）
        const service = services.find((s) => s.name === serviceName)
        if (!service) return null

        const response = await fetch(`/api/services/${service.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch service details")
        }

        const serviceDetail = await response.json()

        // 缓存服务详情
        setServiceDetails((prev) => ({
          ...prev,
          [serviceName]: serviceDetail,
        }))

        return serviceDetail
      } catch (err) {
        console.error("Error fetching service details:", err)
        return null
      }
    },
    [services, serviceDetails]
  )

  // 获取服务的可用时长
  const getServiceDurations = useCallback(
    (serviceName: string): ServiceDuration[] => {
      const serviceDetail = serviceDetails[serviceName]
      if (!serviceDetail || !serviceDetail.is_active) return []

      return serviceDetail.durations.filter((d) => d.is_active)
    },
    [serviceDetails]
  )

  // 计算服务价格
  const getServicePrice = useCallback(
    (serviceName: string, duration: number): number => {
      const serviceDetail = serviceDetails[serviceName]
      if (!serviceDetail || !serviceDetail.is_active) return 0

      const durationData = serviceDetail.durations.find(
        (d) => d.duration === duration && d.is_active
      )

      return durationData?.customer_price || 0
    },
    [serviceDetails]
  )

  // 计算员工收入
  const getStaffIncome = useCallback(
    (serviceName: string, duration: number): number => {
      const serviceDetail = serviceDetails[serviceName]
      if (!serviceDetail || !serviceDetail.is_active) return 0

      const durationData = serviceDetail.durations.find(
        (d) => d.duration === duration && d.is_active
      )

      return durationData?.staff_income || 0
    },
    [serviceDetails]
  )

  return {
    services,
    serviceDetails,
    loading,
    error,
    getServiceNames,
    getServiceByName,
    getServiceDurations,
    getServicePrice,
    getStaffIncome,
    refetch: fetchServices,
  }
}
