module.exports = {
  listVersionsForEntity: async (ctx) => {
    const { collectionId, entryId } = ctx.params;
    const versionModel = strapi.query('version', 'versioning-mongo');
    const versions = await versionModel.find({
      collectionId,
      entryId: entryId || '1',
    });

    ctx.send(versions);
  },

  getVersionForEntity: async (ctx) => {
    const { collectionId, entryId, versionId } = ctx.params;
    const versionModel = strapi.query('version', 'versioning-mongo');
    const version = await versionModel.findOne({
      id: versionId,
      collectionId,
      entryId: entryId || '1',
    });

    ctx.send(version);
  }

};