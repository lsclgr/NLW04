import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUserRepository = getCustomRepository(SurveysUsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (!userAlreadyExists) {
      return response.status(400).json({
        error: "user does not exists",
      });
    }

    const surveyAlreadyExists = await surveysRepository.findOne({
      id: survey_id,
    });
    if (!surveyAlreadyExists) {
      return response.status(400).json({
        error: "survey does not exists",
      });
    }

    //salvar as informacoes na tabela surveyUser
    const surveyUser = surveysUserRepository.create({
      user_id: userAlreadyExists.id,
      survey_id,
    });
    await surveysUserRepository.save(surveyUser);

    //enviar email para o usuario
    await SendMailService.execute(
      email,
      surveyAlreadyExists.title,
      surveyAlreadyExists.description
    );

    return response.json(surveyUser);
  }
}
export { SendMailController };
