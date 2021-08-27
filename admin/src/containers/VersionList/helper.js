module.exports.sanitizeVersionList = (versions) => {
  return versions
    .map(version => {
      const createdAtDate = new Date(version.created_at)
      return {
        id: version.id, // @buffetjs uses this as the child `key`
        createdAt: createdAtDate.toLocaleString(),
        createdAtDate,
        updatedBy: version.updatedBy.name,
        globalName: version.globalName,
        collectionName: version.collectionName,
        entryId: version.entryId,
      }
    })
    .sort((a, b) => b.createdAtDate - a.createdAtDate)
}
