import User from '../../auth/models/user.model';
import Category from '../../core/models/category.model';
import File from '../../core/models/file.model';
import Project, { ProjectUpdate } from '../../core/models/project.model';
import ResourceLink from '../../core/models/resource-link.model';
import MiscUtils from './misc.utils';

export default class Parser {
  public static parseFile(object: any): File {
    const fileFields: string[] = ['extension', 'size', 'type', 'base64'];
    MiscUtils.hasRequiredData(object, fileFields);
    const file: File = {
      extension: object.extension.toString(),
      size: parseInt(object.size.toString()),
      type: object.type.toString(),
      base64: object.base64.toString()
    };
    return file;
  }

  public static parseProject(object: any): Project {
    const projectFields: string[] = [
      'name',
      'description',
      'shortDescription',
      'highlighted',
      'visible',
      'semester',
      'year'
    ];
    MiscUtils.hasRequiredData(object, projectFields);
    const project: Project = {
      name: object.name.toString(),
      description: object.description.toString(),
      shortDescription: object.shortDescription.toString(),
      highlighted: object.highlighted.toString() == 'true' ? true : false,
      visible: object.visible.toString() == 'true' ? true : false,
      semester: object.semester.toString(),
      categories:
        object.categories && object.categories.constructor === Array ? object.categories : [],
      year: object.year.toString()
    };
    return project;
  }

  public static parseProjectUpdate(object: any): ProjectUpdate {
    const projectUpdateFields: string[] = ['title', 'description', 'date'];
    MiscUtils.hasRequiredData(object, projectUpdateFields);
    const projectUpdate: ProjectUpdate = {
      title: object.title.toString(),
      description: object.description.toString(),
      date: new Date(object.date.toString())
    };
    return projectUpdate;
  }

  public static parseUser(object: any): User {
    const userFields: string[] = ['name', 'surname', 'role', 'email', 'enabled'];
    MiscUtils.hasRequiredData(object, userFields);
    const user: User = {
      role: object.role.toString(),
      email: object.email.toString(),
      name: object.name.toString(),
      surname: object.surname.toString(),
      enabled: object.enabled.toString() == 'true' ? true : false
    };
    return user;
  }

  public static parseCategory(object: any): Category {
    const catFields: string[] = [
      'name',
      'label',
      'description',
      'textHexColor',
      'backgroundHexColor'
    ];
    MiscUtils.hasRequiredData(object, catFields);
    const category: Category = {
      name: object.name.toString(),
      label: object.label.toString(),
      description: object.description.toString(),
      textHexColor: object.textHexColor.toString(),
      backgroundHexColor: object.backgroundHexColor.toString()
    };
    return category;
  }

  public static parseResourceLink(object: any): ResourceLink {
    const linkFields: string[] = ['title', 'description', 'url', 'public', 'type'];
    MiscUtils.hasRequiredData(object, linkFields);
    const link: ResourceLink = {
      title: object.title.toString(),
      description: object.description.toString(),
      url: object.url.toString(),
      public: object.public.toString() == 'true' ? true : false,
      type: object.type.toString()
    };
    return link;
  }
}
