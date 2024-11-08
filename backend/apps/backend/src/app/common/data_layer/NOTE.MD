# On Why use Defer Operator in the DataLayer

Defer is a creational operator that creates observables. Before discussing why use `Defer`, let's first discuss why use `Observables`.

***Table of Contents***

1. [What are Observables](#what-are-observables)

    1. [What is Reactive Programming](#what-is-reactive-programming)
    2. [What is the Observer Pattern](#what-is-the-observer-pattern)
    3. [What is an Observable](#what-is-an-observable)
    4. [What is an Observer](#what-is-an-observer)
    5. [Observer VS Subscription](#observer-vs-subscription)

2. [Why use Observables in the data layer instead of Promises](#why-use-observables-in-the-data-layer-instead-of-promises)
3. [What is Defer](#what-is-defer)
4. [Why use Defer in the data layer](#why-use-defer)

## What are Observables

Observables are a necessary part of ***Reactive Programming Paradigm*** following the ***Observer Pattern***. They shine in ***asynchrounous programming*** as they add more functionalities and capabilities to ***Promises*** making them more general, more practical and even more efficient in many cases.

### What is Reactive Programming

Reactive programming is an asynchrounous oriented programming paradigm. It is based on data streams and the propagation of change. It isolates data pipelines, data creation, processing and consumption, making ***the system parts isolated from each other***. Hence, it prevents the case where we have strong coupling between system components.

The major points for **Reactive Programming** come from the fact it decouples between system components which:

- Help with component/service monitoring, management, load balancing ( we can make more instances of this service without affecting other components ) and even partition ( distribute the service over the network ) due to isolation.
- Make our system robust and fault tolerant. With Reactive programming, it is easier to handle faults, errors, system failures and other corner cases: it is just another set of operators in the data pipeline.

### What is the Observer Pattern

The Observer pattern is a software design pattern in which an ***object***, known as a **subject** or an **observable**, maintains a list of its ***dependents***, called **observers**, and **notifies** them automatically of any **state changes**, usually by calling one of their methods. It is essentially a foundation for event-driven and reactive programming systems where changes in one object trigger behavior in others through a well-defined mechanism.

*The Observer pattern is pivotal in reactive programming, allowing data or events to be **propagated** through **a decoupled system** where **components** can **react** to **changes** **dynamically**.*

### What is an Observable

The official documentation defines Observables as the following ***"A lazy push collection of multiple values"*** meaning ***"A collection of items over time"***. A bit not so clear? Yeah it is way simpler than it sounds.Let's explain it bit by bit:

- Observables are like the upgrade of Promises. If Promises support asynchrounous computations by being **a representation on a one single future value**, Observables are the ***the representation of multiple future values not just one***. **Observables** are a ***stream of data***.
- Observables are **a push collection of multiple values** as they are essentially producers of multiple values, pushing them to subscribers over time.
- Observales are **lazy** evaluated meaning **they are executed only when they are needed**. Observables are lazy because they do not start emitting data until a subscriber has subscribed. This means that the code defined in an Observable does not run until there is a subscriber.
- ***Subscriptions*** to Observables ***can*** be ***canceled***, which is a key feature that promises lack. This allows for ***fine control over resource management***, such as terminating ongoing tasks, stopping event listeners, or handling cleanup operations when no longer needed.

### What is an Observer

An ***Observer*** is a ***consumer*** of values delivered by an Observable. ***Observers are simply a set of callbacks for each type of notification***.

The **subscription process** ***ties*** the ***Observable's behavior*** (as defined at the moment of its creation) to the ***Observer's methods***, which ***react*** to the values, errors, or the completion notice.

### Observer VS Subscription

While the terms ***"Observer"*** and ***"Subscription"*** are sometimes used interchangeably in casual conversation about RxJS, they have distinct roles:

- **Observer**: Defines how to react to notifications from an Observable.
- **Subscription**: Represents the execution of an Observable and typically has a mechanism (`unsubscribe()`) to cancel the execution.

## Why use Observables in the data layer instead of Promises

As I mentionned before, ***Reactive Systems*** are a paradigm that allows very loose coupling between different system components.

We would prefer making our systems components as reactive as possible to make extension, change, removal as well as duplication of different system componenets doesn't force us to change some parts elsewhere in the system.

In the Nestjs world to make a loose coupling between the business logic and the data layer, we would implement it using RxJS.

Using Observables for the data layer in a NestJS application is an approach that can enhance the **flexibility**, **scalability**, and **responsiveness** of your application, especially when dealing with asynchronous data streams. NestJS, a progressive Node.js framework for building server-side applications, integrates well with RxJS, the library that provides Observable-based APIs. This integration allows you to leverage reactive programming techniques within your server-side logic.

***Benefits of Using Observables in the Data Layer:***

1. **Improved Asynchronous Handling**: Observables provide a **powerful abstraction** for dealing with asynchronous operations, such as database queries or external API calls. They can manage multiple asynchronous data streams more efficiently than Promises, especially when operations are complex or involve conditional and dependent steps.

2. **Stream-Based Approach**: Observables treat events as collections, allowing developers to apply operations like `filter`, `map`, `reduce`, and more on these streams of data. This is particularly useful in the data layer for transforming responses, combining multiple data sources, or handling side effects in a controlled manner.

3. **Fine-Grained Control Over Data Flow**: Observables offer operators that give you **precise control** over how data is emitted, transformed, and consumed. For instance, operators like `debounceTime`, `throttleTime`, and `distinctUntilChanged` are useful for **optimizing performance** when dealing with high-frequency data updates (e.g., live user inputs).

4. **Built-In Cancellation Logic**: With Observables, subscription management includes built-in support for **cancellations**. This feature is invaluable for long-running queries or streams, where you might want to abort an operation based on certain conditions, such as a user navigating away from a page or a timeout.

5. **Backpressure Management**: RxJS provides mechanisms to handle **backpressure—situations where data is emitted faster than it can be processed**. Using operators like `bufferTime` or `window`, you can manage how data is buffered and released, which can be critical for **maintaining performance** in data-intensive applications.

6. **Error Handling**: Observables come with robust error handling capabilities. Using the `catchError` operator, you can gracefully handle exceptions at any point in the stream and decide on recovery strategies, such as retrying the failed operation or switching to a different data source.

**In NestJS, integrating Observables in the data layer often involves using services and controllers that subscribe to and emit Observables**.

Using Observables in the data layer can lead to more robust, efficient, and scalable applications, especially as complexities grow in handling asynchronous data streams or when performance under load is critical.

## What is Defer

`defer` is a **creational RxJS operator**. It creates an Observable that, on subscribe, calls an Observable factory to make an Observable for each new Observer.

`defer` allows you to create an Observable **only** when the **Observer subscribes**. It waits until an Observer subscribes to it, calls the given factory function to get an Observable -- where a factory function typically generates a new Observable -- and subscribes the Observer to this Observable. In case the factory function returns a falsy value, then EMPTY is used as Observable instead. Last but not least, an exception during the factory function call is transferred to the Observer by calling error.

## Why use Defer

`defer` can be a valuable addition to your data handling strategies in a server-side environment:

1. **Dynamic Data Source Initialization**

`defer` ensures that the data source or any operation is not initiated until a subscriber begins to observe. This is particularly useful in scenarios where **the data retrieval process needs to incorporate conditions or parameters that change over time or per request**.
2. **Just-in-Time Execution**

Data operations in a server-side context often involve expensive operations, such as database connections or external API calls. `defer` can ***delay these operations until they are absolutely necessary***. This behavior reduces unnecessary usage of resources and ensures that operations like database reads are done with the most current context (e.g., user session, request-specific parameters).
3. **Freshness of Data**

In scenarios where ***data may change frequently***, using `defer` guarantees that the data fetched is up-to-date. This is crucial for applications where stale data can lead to incorrect business logic execution, such as in financial transactions or real-time monitoring systems.
4. **Handling User-Specific or Contextual Information**

When the output of **a data call depends on contextual information** (like the current time, session state, or dynamically generated queries based on user input), `defer` can dynamically construct the Observable sequence for each observer, ensuring that the context is captured accurately and reflected in the operation.
5. **Avoiding Unintended Side Effects**

By deferring the creation of the Observable until subscription, you **avoid unintended side effects** that might occur if the Observable were created at the point of definition (which might be too early). This is important in NestJS modules where dependencies or other services might not be fully initialized at the time of service construction.
