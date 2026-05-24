import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { ChatService, ChatResponse } from './chat.service'

describe('ChatService', () => {
  let service: ChatService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService],
    })
    service = TestBed.inject(ChatService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => httpMock.verify())

  it('sends previousResponseId in request body', async () => {
    const sendPromise = service.sendMessage('hello')

    const req = httpMock.expectOne('/api/v1/chat')
    expect(req.request.body).toEqual({ message: 'hello', previousResponseId: null })
    req.flush({
      success: true,
      data: { message: 'Hi there', previousResponseId: 'resp_abc123' },
    } satisfies ChatResponse)

    await sendPromise
    expect(service.messageList().at(-1)?.content).toBe('Hi there')
  })

  it('uses previousResponseId from previous response in next request', async () => {
    // First message
    const p1 = service.sendMessage('first')
    const req1 = httpMock.expectOne('/api/v1/chat')
    req1.flush({
      success: true,
      data: { message: 'First reply', previousResponseId: 'resp_first' },
    } satisfies ChatResponse)
    await p1

    // Second message should send the stored previousResponseId
    const p2 = service.sendMessage('second')
    const req2 = httpMock.expectOne('/api/v1/chat')
    expect(req2.request.body.previousResponseId).toBe('resp_first')
    req2.flush({
      success: true,
      data: { message: 'Second reply', previousResponseId: 'resp_second' },
    } satisfies ChatResponse)
    await p2
  })
})
