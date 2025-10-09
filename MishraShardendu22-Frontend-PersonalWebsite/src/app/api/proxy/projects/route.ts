import { NextRequest } from 'next/server'
import { proxyRequest, createApiPathMapping } from '@/lib/proxy-utils'

export async function GET(req: NextRequest) {
  return proxyRequest(req, createApiPathMapping('/projects'))
}

export async function POST(req: NextRequest) {
  return proxyRequest(req, createApiPathMapping('/projects'))
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req, createApiPathMapping('/projects'))
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req, createApiPathMapping('/projects'))
}
