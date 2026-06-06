migrate(
  (app) => {
    const segmentos = new Collection({
      name: 'segmentos',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(segmentos)

    const gerentes = new Collection({
      name: 'gerentes_carteira',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'segmento_id',
          type: 'relation',
          required: true,
          collectionId: segmentos.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(gerentes)

    const mapeamentos = app.findCollectionByNameOrId('mapeamentos')
    mapeamentos.fields.add(
      new RelationField({
        name: 'gerente_carteira_id',
        collectionId: gerentes.id,
        cascadeDelete: false,
        maxSelect: 1,
      }),
    )

    mapeamentos.fields.add(new DateField({ name: 'auto_expiry' }))
    mapeamentos.fields.add(new TextField({ name: 'auto_carrier' }))
    mapeamentos.fields.add(new DateField({ name: 'health_expiry' }))
    mapeamentos.fields.add(new TextField({ name: 'health_carrier' }))
    mapeamentos.fields.add(new DateField({ name: 'dental_expiry' }))
    mapeamentos.fields.add(new TextField({ name: 'dental_carrier' }))
    mapeamentos.fields.add(new DateField({ name: 'property_expiry' }))
    mapeamentos.fields.add(new TextField({ name: 'property_carrier' }))
    mapeamentos.fields.add(new DateField({ name: 'life_expiry' }))
    mapeamentos.fields.add(new TextField({ name: 'life_carrier' }))
    mapeamentos.fields.add(new DateField({ name: 'others_expiry' }))
    mapeamentos.fields.add(new TextField({ name: 'others_carrier' }))
    mapeamentos.fields.add(new TextField({ name: 'observations' }))
    mapeamentos.fields.add(
      new RelationField({ name: 'last_contact_by', collectionId: '_pb_users_auth_', maxSelect: 1 }),
    )
    mapeamentos.fields.add(new DateField({ name: 'last_contact_at' }))

    app.save(mapeamentos)
  },
  (app) => {
    const mapeamentos = app.findCollectionByNameOrId('mapeamentos')
    mapeamentos.fields.removeByName('gerente_carteira_id')
    mapeamentos.fields.removeByName('auto_expiry')
    mapeamentos.fields.removeByName('auto_carrier')
    mapeamentos.fields.removeByName('health_expiry')
    mapeamentos.fields.removeByName('health_carrier')
    mapeamentos.fields.removeByName('dental_expiry')
    mapeamentos.fields.removeByName('dental_carrier')
    mapeamentos.fields.removeByName('property_expiry')
    mapeamentos.fields.removeByName('property_carrier')
    mapeamentos.fields.removeByName('life_expiry')
    mapeamentos.fields.removeByName('life_carrier')
    mapeamentos.fields.removeByName('others_expiry')
    mapeamentos.fields.removeByName('others_carrier')
    mapeamentos.fields.removeByName('observations')
    mapeamentos.fields.removeByName('last_contact_by')
    mapeamentos.fields.removeByName('last_contact_at')
    app.save(mapeamentos)

    const gerentes = app.findCollectionByNameOrId('gerentes_carteira')
    app.delete(gerentes)

    const segmentos = app.findCollectionByNameOrId('segmentos')
    app.delete(segmentos)
  },
)
