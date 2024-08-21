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

            CreateMap<Team, TeamRequest>();
            CreateMap<TeamRequest, Team>();

            CreateMap<ListMember, ListMemberDto>();
            CreateMap<ListMemberDto, ListMember>();

            CreateMap<Registration, RegistrationRequest>();
            CreateMap<RegistrationRequest, Registration>();
        }
    }
}
