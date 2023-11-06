import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '../projects.service';
import { ProjectsRepository } from '../../projects/projects.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersRepository } from '../../users/users.repository';
import { RoleRepository } from '../../role/role.repository';
import { UsersModule } from '../../users/users.module';
import { ProjectModule } from '../../projects/project.module';
import { RoleModule } from '../../role/role.module';

// ProjectsService 테스트 정의
describe('ProjectsService', () => {
    
    let service: ProjectsService;
    //ProjectRepository의 메소드들을 모두 optional인 jest.Mock 타입으로 가지는 객체 타입
    let mockProjectRepository: Partial<Record<keyof ProjectsRepository, jest.Mock>> = {};
    let mockUsersRepository: Partial<Record<keyof UsersRepository, jest.Mock>> = {};
    let mockRoleRepository: Partial<Record<keyof RoleRepository, jest.Mock>> = {};

    // setup
    beforeEach(async () => {
        // mockProjectRepository를 초기화
        mockProjectRepository = {
            getProjects: jest.fn(),
            findOneProject: jest.fn(),
            createNewProject: jest.fn(),
            updateProject: jest.fn(),
            softDeleteProject: jest.fn(),
        };
        
        // TestingModule을 비동기적으로 생성하고 설정
        const module: TestingModule = await Test.createTestingModule({
            imports: [UsersModule, ProjectModule, RoleModule],
            //테스트할 서비스와 모의 리포지토리를 providers 배열에 추가
            providers: [
                ProjectsService,
                {
                    provide: getRepositoryToken(UsersRepository),
                    useValue: mockUsersRepository, // 여기서 mockUsersRepository는 UsersRepository의 모의 구현체입니다.
                },
                {
                    //getRepositoryToken을 사용하여 ProjectRepository 토큰을 생성 후
                    // mockProjectRepository에 연결
                    provide: getRepositoryToken(ProjectsRepository),
                    useValue: mockProjectRepository,
                },
                {
                    provide: getRepositoryToken(RoleRepository),
                    useValue: mockRoleRepository, // 여기서 mockRoleRepository는 RoleRepository의 모의 구현체입니다.
                },
            ],
        }).compile();

        // 컴파일된 모듈에서 ProjectsService를 가져옴
        service = module.get<ProjectsService>(ProjectsService);
    });

    // ProjectsService 인스턴스가 정의되어 있는지 테스트
    it('함수 정의 확인', () => {
        // service 인스턴스가 성공적으로 생성되었는지 expect 함수를 사용해 검증
        expect(service).toBeDefined();
        // toBeDefined() : service 변수가 undefined가 아닌 값을 가지고 있는지 검증
    });

    // 테스트 케이스 작성
    describe('프로젝트 목록 조회[getProjects]', () => {
        // 테스트 시작
        it('프로젝트 페이지네이션 결과 조회', async () => {
            
            const result = {
                data: [],
                count: 0,
                page: 1,
                limit: 10,
            };
            // mockProjectRepository의 getProjects 메소드를 호출하면 해당 값을 반환하도록 설정
            mockProjectRepository.getProjects.mockResolvedValue([[], 0]);

            // service의 getProjects 결과가 기대하는 객체와 같은지 검증
            expect(await service.getProjects({ page: 1, limit: 10 })).toEqual(result);

            // findProjects가 인자(1, 10)와 함께 호출되었는지 검증
            expect(mockProjectRepository.getProjects).toHaveBeenCalledWith(1,10 );

        });
    });
})