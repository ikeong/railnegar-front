export const useActiveRoute = () => {
  const route = useRoute()

  /**
   * Check if the given path is the current active route
   * @param path - The path to check
   * @param exact - Whether to match exactly (default: false)
   * @returns true if the path is active, false otherwise
   */
  const isActive = (path: string, exact: boolean = false): boolean => {
    if (exact) {
      return route.path === path
    }
    return route.path.startsWith(path)
  }

  return {
    isActive
  }
}
