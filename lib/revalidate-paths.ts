'use server'

import { revalidatePath } from "next/cache"

export async function revalidatePaths(paths: string[]) {
  try {
    await Promise.all(paths.map((path) => revalidatePath(path)))
    console.log(`✅ Revalidated paths: ${paths.join(', ')}`)
  } catch (error) {
    console.error('❌ Failed to revalidate paths:', error)
  }
}
