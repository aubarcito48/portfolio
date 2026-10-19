import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from '../../app';
import { environment } from '../../../environments/environment';
import {
  testEducation,
  testExperiences,
  testLinks,
  testPage,
  testProfile,
  testProjects,
  testTechnologyGroups,
} from './portfolio-test-data';

export async function createLoadedApp(): Promise<ComponentFixture<App>> {
  const fixture = TestBed.createComponent(App);
  const http = TestBed.inject(HttpTestingController);
  const requests = http.match((request) => request.url.startsWith(environment.apiBaseUrl));
  const responses = new Map<string, unknown>([
    ['/perfil/', testProfile],
    ['/tecnologias/', testPage(testTechnologyGroups)],
    ['/experiencias/', testPage(testExperiences)],
    ['/formacion/', testPage(testEducation)],
    ['/proyectos/', testPage(testProjects)],
    ['/enlaces/', testPage(testLinks)],
  ]);

  for (const request of requests) {
    const path = request.request.url.slice(environment.apiBaseUrl.length);
    const response = responses.get(path);
    if (response === undefined) {
      throw new Error(`No hay una respuesta de prueba para ${path}.`);
    }
    request.flush(response);
  }

  fixture.detectChanges();
  await fixture.whenStable();
  return fixture;
}
