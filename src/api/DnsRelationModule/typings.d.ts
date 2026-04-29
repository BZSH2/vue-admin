declare namespace DnsRelationModule {
  interface CreateDnsRelationDto {
    projectName: string
    serviceName?: string | null
    environment?: 'dev' | 'test' | 'staging' | 'uat' | 'prod'
    domain: string
    provider?: string | null
    recordType: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX' | 'NS' | 'SRV'
    recordValue: string
    enabled?: boolean
    remark?: string | null
  }

  interface DnsRelation {
    id: string
    projectName: string
    serviceName: string | null
    environment: Record<string, any>
    domain: string
    provider: string | null
    recordType: Record<string, any>
    recordValue: string
    enabled: boolean
    remark: string | null
    createdAt: string | Date
    updatedAt: string | Date
    deletedAt: string | Date | null
  }

  interface UpdateDnsRelationDto {
    projectName?: string
    serviceName?: string | null
    environment?: 'dev' | 'test' | 'staging' | 'uat' | 'prod'
    domain?: string
    provider?: string | null
    recordType?: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX' | 'NS' | 'SRV'
    recordValue?: string
    enabled?: boolean
    remark?: string | null
  }
}
