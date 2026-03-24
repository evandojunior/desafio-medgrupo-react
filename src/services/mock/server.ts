import { createServer, Model, belongsTo, hasMany, RestSerializer, Response } from 'miragejs';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

let _server: ReturnType<typeof createServer> | null = null;

export async function makeServer() {
  if (_server) {
    _server.shutdown();
  }

  const storedDB = await AsyncStorage.getItem('mirage_db');
  let initialData = null;
  if (storedDB) {
    try {
      initialData = JSON.parse(storedDB);
    } catch (e) {}
  }

  _server = createServer({
    models: {
      school: Model.extend({
        classes: hasMany(),
      }),
      class: Model.extend({
        school: belongsTo(),
      }),
    },

    serializers: {
      application: RestSerializer,
    },

    seeds(server) {
      if (initialData) {
        server.db.loadData(initialData);
      }
      // Empty database by default — no seeds
    },

    routes() {
      this.urlPrefix = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
      this.namespace = 'api';
      this.timing = 300;

      const persistDB = () => {
        AsyncStorage.setItem('mirage_db', JSON.stringify(this.db.dump())).catch(() => {});
      };

      // Schools
      this.get('/schools', (schema) => {
        const schools = schema.all('school');
        return schools.models.map((school) => ({
          id: school.id,
          name: (school as any).name,
          address: (school as any).address,
          createdAt: (school as any).createdAt,
          classesCount: schema.where('class', { schoolId: school.id } as any).models.length,
        }));
      });

      this.post('/schools', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const res = schema.create('school', {
          id: uuidv4(),
          ...attrs,
          createdAt: new Date().toISOString(),
        });
        persistDB();
        return {
          id: res.id,
          name: (res as any).name,
          address: (res as any).address,
          createdAt: (res as any).createdAt,
          classesCount: 0,
        };
      });

      this.get('/schools/:id', (schema, request) => {
        const school = schema.find('school', request.params.id);
        if (!school) return new Response(404, {}, { message: 'Escola não encontrada' });
        return {
          id: school.id,
          name: (school as any).name,
          address: (school as any).address,
          createdAt: (school as any).createdAt,
          classesCount: schema.where('class', { schoolId: school.id } as any).models.length,
        };
      });

      this.patch('/schools/:id', (schema, request) => {
        const school = schema.find('school', request.params.id);
        if (!school) return new Response(404, {}, { message: 'Escola não encontrada' });
        const attrs = JSON.parse(request.requestBody);
        school.update(attrs);
        persistDB();
        return {
          id: school.id,
          name: (school as any).name,
          address: (school as any).address,
          createdAt: (school as any).createdAt,
          classesCount: schema.where('class', { schoolId: school.id } as any).models.length,
        };
      });

      this.del('/schools/:id', (schema, request) => {
        const school = schema.find('school', request.params.id);
        if (!school) return new Response(404, {}, { message: 'Escola não encontrada' });
        schema.where('class', { schoolId: request.params.id } as any).destroy();
        school.destroy();
        persistDB();
        return new Response(204);
      });

      // Classes
      this.get('/schools/:schoolId/classes', (schema, request) => {
        return schema
          .where('class', { schoolId: request.params.schoolId } as any)
          .models.map((c) => ({
            id: c.id,
            schoolId: (c as any).schoolId,
            name: (c as any).name,
            shift: (c as any).shift,
            academicYear: (c as any).academicYear,
            createdAt: (c as any).createdAt,
          }));
      });

      this.post('/schools/:schoolId/classes', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const classRecord = schema.create('class', {
          id: uuidv4(),
          schoolId: request.params.schoolId,
          ...attrs,
          academicYear: Number(attrs.academicYear),
          createdAt: new Date().toISOString(),
        });
        persistDB();
        return {
          id: classRecord.id,
          schoolId: (classRecord as any).schoolId ?? request.params.schoolId,
          name: (classRecord as any).name,
          shift: (classRecord as any).shift,
          academicYear: Number((classRecord as any).academicYear),
          createdAt: (classRecord as any).createdAt,
        };
      });

      this.patch('/classes/:id', (schema, request) => {
        const classRecord = schema.find('class', request.params.id);
        if (!classRecord) return new Response(404, {}, { message: 'Turma não encontrada' });
        const attrs = JSON.parse(request.requestBody);
        classRecord.update(attrs);
        persistDB();
        return {
          id: classRecord.id,
          schoolId: (classRecord as any).schoolId,
          name: (classRecord as any).name,
          shift: (classRecord as any).shift,
          academicYear: (classRecord as any).academicYear,
          createdAt: (classRecord as any).createdAt,
        };
      });

      this.del('/classes/:id', (schema, request) => {
        const classRecord = schema.find('class', request.params.id);
        if (!classRecord) return new Response(404, {}, { message: 'Turma não encontrada' });
        classRecord.destroy();
        persistDB();
        return new Response(204);
      });
    },
  });

  return _server;
}
