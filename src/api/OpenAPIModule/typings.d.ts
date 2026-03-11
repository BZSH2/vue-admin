declare namespace OpenAPIModule {
  interface ModuleSelectionDto {
    /** Service prefix (Tag) */
    prefix: string
    /** List of modules to export */
    service: string[]
  }

  interface PostOpenApiDto {
    /** List of module selections */
    modules: ModuleSelectionDto[]
  }
}
