using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using AutoMapper;

namespace ApiRovTournament
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Tournament, TournamentRequest>();
            CreateMap<TournamentRequest, Tournament>();

            CreateMap<Level, LevelRequest>();
            CreateMap<LevelRequest, Level>();

            CreateMap<ListLevel, ListLevelDto>();
            CreateMap<ListLevelDto, ListLevel>();

            CreateMap<ListPrize, ListPrizeDto>();
            CreateMap<ListPrizeDto, ListPrize> ();

            CreateMap<Team, TeamRequest>();
            CreateMap<TeamRequest, Team>();

            CreateMap<ListMember, ListMemberDto>();
            CreateMap<ListMemberDto, ListMember>();

            CreateMap<ListTrainer, ListTrainerDto>();
            CreateMap<ListTrainerDto, ListTrainer>();

            CreateMap<Registration, RegistrationRequest>();
            CreateMap<RegistrationRequest, Registration>();

            CreateMap<Certificate, CertificateRequest>();
            CreateMap<CertificateRequest, Certificate>();


            CreateMap<Competition, CompetitionRequest>();
            CreateMap<CompetitionRequest, Competition>();

            CreateMap<CompetitionList, CompetitionListDto>();
            CreateMap<CompetitionListDto, CompetitionList>();

            CreateMap<ListNameCompetitionDetails, ListNameCompetitionDetailsDto>();
            CreateMap<ListNameCompetitionDetailsDto, ListNameCompetitionDetails>();

            CreateMap<AllDetail, AllDetailRequest>();
            CreateMap<AllDetailRequest, AllDetail>();

            CreateMap<Compete, CompeteRequest>();
            CreateMap<CompeteRequest, Compete>();

            CreateMap<ListLevelCompete, ListLevelCompeteDto>();
            CreateMap<ListLevelCompeteDto, ListLevelCompete>();

            CreateMap<RegistrationCompete, RegistrationCompeteRequest>();
            CreateMap<RegistrationCompeteRequest, RegistrationCompete>();

            CreateMap<TextInImage, TextInImageRequest>();
            CreateMap<TextInImageRequest, TextInImage>();

            CreateMap<SignerDetail, SignerDetailRequest>();
            CreateMap<SignerDetailRequest, SignerDetail>();

            CreateMap<ListSignerDetail, ListSignerDetailDto>();
            CreateMap<ListSignerDetailDto, ListSignerDetail>();
        }
    }
}
