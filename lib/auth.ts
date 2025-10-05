import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  department?: string
  position?: string
  bio?: string
  avatar?: string
  role: 'ADMIN' | 'USER'
  churchId?: string
  churchName?: string
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    console.log('Looking for user with email:', email)
    const user = await prisma.user.findUnique({
      where: { email },
      include: { church: true }
    })

    if (!user) {
      console.log('User not found for email:', email)
      return null
    }

    console.log('User found:', user.email, 'Role:', user.role)
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', email)
      return null
    }

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || undefined,
      department: user.department || undefined,
      position: user.position || undefined,
      bio: user.bio || undefined,
      avatar: user.avatar || undefined,
      role: user.role,
      churchId: user.churchId || undefined,
      churchName: user.church?.name
    }
    console.log('Returning user data:', userData)
    return userData
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: 'ADMIN' | 'USER'
  churchName?: string
  churchAddress?: string
}) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Create church if user is admin
    let churchId: string | undefined
    if (userData.role === 'ADMIN' && userData.churchName) {
      const church = await prisma.church.create({
        data: {
          name: userData.churchName,
          address: userData.churchAddress
        }
      })
      churchId = church.id
    }

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role,
        churchId
      },
      include: { church: true }
    })

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      churchId: user.churchId || undefined,
      churchName: user.church?.name
    }
  } catch (error) {
    console.error('User creation error:', error)
    throw error
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { church: true }
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || undefined,
      department: user.department || undefined,
      position: user.position || undefined,
      bio: user.bio || undefined,
      avatar: user.avatar || undefined,
      role: user.role,
      churchId: user.churchId || undefined,
      churchName: user.church?.name
    }
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}
