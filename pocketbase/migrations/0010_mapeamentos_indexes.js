migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('mapeamentos')
    col.addIndex('idx_mapeamentos_gerente', false, 'gerente_carteira_id', '')
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('mapeamentos')
    col.removeIndex('idx_mapeamentos_gerente')
    app.save(col)
  },
)
