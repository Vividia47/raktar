using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using WarehouseAPI.Models;

namespace WarehouseAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var conn = builder.Configuration.GetConnectionString("MySql");

            builder.Services.AddDbContext<WarehouseContext>(
                    options =>
                    {
                        if (conn != null)
                        {
                            options.UseMySQL(conn);
                        }
                    }
                );

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
